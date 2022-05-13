FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code/
COPY requirements.txt .
RUN py install -r requirements.txt
COPY . .