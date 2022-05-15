FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code/backend/
COPY requirements.txt .
RUN py install -r requirements.txt
COPY . .