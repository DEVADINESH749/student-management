from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session
import httpx

from .database import Base, engine, get_db
from .models import Course, course_students
from .schemas import CourseCreate, CourseResponse, CourseUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student Management - Course Service",
    version="1.0.0"
)


STUDENT_SERVICE_URL = "http://127.0.0.1:8002"


@app.get("/")
def root():
    return {"message": "Course Service is running"}


@app.post(
    "/courses",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED
)
def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db)
):
    existing_course = (
        db.query(Course)
        .filter(Course.code == course.code)
        .first()
    )

    if existing_course:
        raise HTTPException(
            status_code=400,
            detail="Course code already exists"
        )

    new_course = Course(**course.model_dump())

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return new_course


@app.get("/courses", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@app.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return course


@app.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    course_data: CourseUpdate,
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    for field, value in course_data.model_dump().items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)

    return course


@app.delete("/courses/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    db.execute(
        course_students.delete().where(
            course_students.c.course_id == course_id
        )
    )

    db.delete(course)
    db.commit()

    return {"message": "Course deleted successfully"}


@app.post("/courses/{course_id}/students/{student_id}")
def assign_student(
    course_id: int,
    student_id: int,
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    try:
        response = httpx.get(
            f"{STUDENT_SERVICE_URL}/students/{student_id}",
            timeout=5.0
        )
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Student Service is unavailable"
        )

    if response.status_code == 404:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="Unable to verify student"
        )

    existing_assignment = db.execute(
        course_students.select().where(
            course_students.c.course_id == course_id,
            course_students.c.student_id == student_id
        )
    ).first()

    if existing_assignment:
        raise HTTPException(
            status_code=400,
            detail="Student is already assigned to this course"
        )

    db.execute(
        course_students.insert().values(
            course_id=course_id,
            student_id=student_id
        )
    )

    db.commit()

    return {
        "message": "Student assigned to course successfully",
        "course_id": course_id,
        "student_id": student_id
    }


@app.get("/courses/{course_id}/students")
def get_enrolled_students(
    course_id: int,
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    assignments = db.execute(
        course_students.select().where(
            course_students.c.course_id == course_id
        )
    ).fetchall()

    students = []

    for assignment in assignments:
        student_id = assignment.student_id

        try:
            response = httpx.get(
                f"{STUDENT_SERVICE_URL}/students/{student_id}",
                timeout=5.0
            )
        except httpx.RequestError:
            continue

        if response.status_code == 200:
            students.append(response.json())

    return {
        "course_id": course_id,
        "students": students
    }
