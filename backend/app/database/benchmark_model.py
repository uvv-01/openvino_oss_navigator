from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float

from .connection import Base


class Benchmark(Base):
    __tablename__ = "benchmarks"

    id = Column(Integer, primary_key=True, index=True)

    openvino_version = Column(String)
    model = Column(String)
    hardware = Column(String)

    fps = Column(Float)
    latency = Column(Float)