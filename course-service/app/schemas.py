from pydantic import BaseModel


class CourseBase(BaseModel):
    name: str
    code: str
    description: str | None = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    pass


class CourseResponse(CourseBase):
    id: int

    class Config:
        from_attributes = True
