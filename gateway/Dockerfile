FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /gateway/
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . ./