FROM python:3.10
ENV PYTHONUNBUFFERED=1
WORKDIR /backend/
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . ./