FROM python:3.10
ENV PYTHONUNBUFFERED=1
WORKDIR /backend/
RUN python -m venv env
ENV PATH="env/bin:$PATH"
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . ./