FROM python:3.10
ENV PYTHONUNBUFFERED=1
WORKDIR /gateway/
RUN python -m venv env
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . ./