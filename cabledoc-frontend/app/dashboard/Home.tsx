"use client";
import React, { use, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import BarChart from "../../components/pastui/BarChart";
import PieChart from "../../components/pastui/PieChart";
import {
  cardHeaderColorSecondary,
  cardHeaderThird,
} from "../sidebar/tailwindStyles";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TopPayingClients from "@/components/traffic";
import Image from "next/image";

// Importieren Sie die Methode zur Abfrage des eingeloggten Benutzers

interface CardItem {
  name: string;
  nameColor: string;
  subname?: string;
  subnameColor: string;
  color: string;
  content: JSX.Element;
  children?: React.ReactNode;
}

interface HomeProps {
  //user: User;
  minimizedSidebar: boolean;
}

export default function HomePage({ minimizedSidebar }: HomeProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [maxContentWidth, setMaxContentWidth] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([
    {
      name: "Top Clients",
      nameColor: "text-white",
      subnameColor: "text-slate-200",
      color: cardHeaderColorSecondary,
      content: <TopPayingClients />,
    },
    {
      name: "Bar Chart",
      nameColor: "text-white",
      subnameColor: "text-slate-200",
      color: cardHeaderColorSecondary,
      content: <BarChart />,
    },
    {
      name: "Pie Chart",
      nameColor: "text-slate-100",
      subnameColor: "text-slate-700",
      color: cardHeaderThird,
      content: <PieChart />,
    },
    {
      name: "Carousel",
      nameColor: "text-slate-100",
      subnameColor: "text-slate-700",
      color: cardHeaderThird,
      content: (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {index % 2 === 0 ? ( // Wenn der Index gerade ist
                          <Image src="/img/CDLogo-big.svg" alt="logo" />
                        ) : (
                          // Wenn der Index ungerade ist
                          <Image src="/img/CDLogo-small.svg" alt="logo" />
                        )}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ),
    },
    {
      name: "Calendar",
      nameColor: "text-slate-100",
      subnameColor: "text-slate-700",
      color: cardHeaderThird,
      content: (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      ),
    },
  ]);

  useEffect(() => {
    const getMaxContentWidth = () => {
      let maxContentWidth = 0;
      cards.forEach((card) => {
        const cardContentWidth = document.getElementById(
          `card-content-${card.name}`
        )?.scrollWidth;
        if (cardContentWidth && cardContentWidth > maxContentWidth) {
          maxContentWidth = cardContentWidth;
        }
      });
      return maxContentWidth;
    };

    const width = getMaxContentWidth();
    if (width > maxContentWidth) {
      setMaxContentWidth(width);
    }
  }, [cards]);

  const generateCardId = (index: number) => `card-${index}`;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedCards = Array.from(cards);
    const [removed] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, removed);
    setCards(reorderedCards);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="cardList" direction="horizontal">
        {(provided) => (
          <div
            className="flex flex-wrap justify-center"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <Draggable
                key={card.name}
                draggableId={generateCardId(index)}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2"
                    style={{
                      ...provided.draggableProps.style,
                      userSelect: "none",
                      flex: "1 0 30%",
                      marginBottom: "0px",
                    }}
                  >
                    <Card
                      style={{
                        height: "100%",
                        alignContent: "center",
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg text-center">
                          {card.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent
                        id={`card-content-${card.name}`}
                        className="p-3 flex flex-col justify-center items-center"
                        style={{ padding: "10px" }} // Adjust padding here
                      >
                        {card.content}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
