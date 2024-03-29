from pydantic import BaseModel
from typing import List


class ActivityOut(BaseModel):
    id: str
    name: str


class ImageOut(BaseModel):
    title: str
    altText: str
    url: str


class ParkOut(BaseModel):
    id: str
    url: str
    fullName: str
    parkCode: str
    description: str
    activities: list[ActivityOut]
    states: str
    images: list[ImageOut]


class ListParksOut(BaseModel):
    data: list[ParkOut]
