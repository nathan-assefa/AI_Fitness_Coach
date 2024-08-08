FROM python:3.11-slim


ENV PYTHONUNBUFFERED 1

WORKDIR /ptmx_backend

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /ptmx_backend/
RUN pip install --no-cache-dir -r requirements.txt


COPY . /ptmx_backend/


EXPOSE 8000


# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "ptmx_backend.wsgi:application"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
