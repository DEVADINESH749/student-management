from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx

app = FastAPI(
    title="Student Management API Gateway",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUTH_SERVICE_URL = "http://127.0.0.1:8001"
STUDENT_SERVICE_URL = "http://127.0.0.1:8002"
COURSE_SERVICE_URL = "http://127.0.0.1:8003"


@app.get("/")
def root():
    return {"message": "API Gateway is running"}


async def forward_request(
    request: Request,
    service_url: str,
    path: str
):
    try:
        body = await request.body()

        headers = {}

        content_type = request.headers.get("content-type")
        authorization = request.headers.get("authorization")

        if content_type:
            headers["Content-Type"] = content_type

        if authorization:
            headers["Authorization"] = authorization

        async with httpx.AsyncClient() as client:
            response = await client.request(
                method=request.method,
                url=f"{service_url}{path}",
                headers=headers,
                content=body
            )

        try:
            response_data = response.json()
        except ValueError:
            response_data = {"detail": response.text}

        return JSONResponse(
            status_code=response.status_code,
            content=response_data
        )

    except httpx.RequestError:
        return JSONResponse(
            status_code=503,
            content={"detail": "Service is unavailable"}
        )


@app.api_route(
    "/auth",
    methods=["GET", "POST", "PUT", "DELETE"]
)
async def auth_root(request: Request):
    return await forward_request(
        request,
        AUTH_SERVICE_URL,
        "/auth"
    )


@app.api_route(
    "/auth/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE"]
)
async def auth_gateway(request: Request, path: str):
    return await forward_request(
        request,
        AUTH_SERVICE_URL,
        f"/auth/{path}"
    )


@app.api_route(
    "/students",
    methods=["GET", "POST", "PUT", "DELETE"]
)
async def student_root(request: Request):
    return await forward_request(
        request,
        STUDENT_SERVICE_URL,
        "/students"
    )


@app.api_route(
    "/students/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE"]
)
async def student_gateway(request: Request, path: str):
    return await forward_request(
        request,
        STUDENT_SERVICE_URL,
        f"/students/{path}"
    )


@app.api_route(
    "/courses",
    methods=["GET", "POST", "PUT", "DELETE"]
)
async def course_root(request: Request):
    return await forward_request(
        request,
        COURSE_SERVICE_URL,
        "/courses"
    )


@app.api_route(
    "/courses/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE"]
)
async def course_gateway(request: Request, path: str):
    return await forward_request(
        request,
        COURSE_SERVICE_URL,
        f"/courses/{path}"
    )
