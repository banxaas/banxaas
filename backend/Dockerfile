FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code/backend/
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .