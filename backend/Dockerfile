FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /backend/
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . ./
COPY ./api/repository/bdkserver.pem /backend/api/repository/bdkserver.pem 