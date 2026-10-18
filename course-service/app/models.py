from sqlalchemy import Column, ForeignKey, Integer, String, Table

from .database import Base


course_students = Table(
    "course_students",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
    Column("student_id", Integer, primary_key=True)
)


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
