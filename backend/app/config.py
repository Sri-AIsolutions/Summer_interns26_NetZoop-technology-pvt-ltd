from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://localhost:5432/curriculum_chatbot"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expiry_hours: int = 24
    admin_username: str = "admin"
    admin_password: str = "change-me"
    claude_api_key: str = ""
    claude_model: str = "claude-sonnet-4-20250514"
    app_name: str = "Amrita Curriculum Chatbot"
    debug: bool = True

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
