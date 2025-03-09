import type React from "react";
import { useState, useEffect, useRef } from "react";
import { InputBase, Paper, Container } from "@mui/material";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const previousQueryRef = useRef("");

  useEffect(() => {
    if (query !== previousQueryRef.current) {
      previousQueryRef.current = query;
      onSearch(query);
    }
  }, [query, onSearch]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        my: 3,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 600,
          borderRadius: 30,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.3)",
            transform: "translateY(-2px)",
            background: "rgba(15, 23, 42, 0.7)",
          },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            borderRadius: "30px 30px 0 0",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
            pointerEvents: "none",
          },
        }}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: "1.1rem",
            color: "white",
            "& input::placeholder": {
              color: "white",
              opacity: 0.7,
            },
          }}
          placeholder="Barát keresése..."
          inputProps={{ "aria-label": "search for friends" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Paper>
    </Container>
  );
}
