from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    app_name: str


class EchoNestedItem(BaseModel):
    inner_value: int


class EchoRequest(BaseModel):
    sample_field: str
    nested_items: Optional[list[EchoNestedItem]] = None


class EchoResponseData(BaseModel):
    sample_field: str
    nested_items: Optional[list[EchoNestedItem]] = None


class EchoResponse(BaseModel):
    data: EchoResponseData
    message: str
