FROM python:3.11.4

WORKDIR /app

RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.4.2

ADD requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

ADD . /app/

CMD ["python", "main.py"]
