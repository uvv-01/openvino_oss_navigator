from parser.cpu_parser import parse_cpu
from parser.gpu_parser import parse_gpu
from parser.cpu_gpu_parser import parse_cpu_gpu
from parser.model_server_parser import parse_model_server

from app.database.connection import SessionLocal

db = SessionLocal()

parse_cpu(db)
parse_gpu(db)
parse_cpu_gpu(db)
parse_model_server(db)

db.commit()
db.close()

print("All parsers finished!")