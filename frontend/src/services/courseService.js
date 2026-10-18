import api from "./api";

export const getCourses = async () => {
    const response = await api.get("/courses");
    return response.data;
};

export const getCourse = async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
};

export const createCourse = async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data;
};

export const updateCourse = async (courseId, courseData) => {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
};

export const deleteCourse = async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
};

export const assignStudentToCourse = async (courseId, studentId) => {
    const response = await api.post(
        `/courses/${courseId}/students/${studentId}`
    );
    return response.data;
};

export const getEnrolledStudents = async (courseId) => {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
};
