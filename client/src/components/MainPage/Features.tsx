import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const FeatureCards = [
  {
    image:
      "https://10barberimages.s3.eu-north-1.amazonaws.com/Static/Main/Feature1.jpeg",
    text: "Partnereink",
    linkGoto: "https://www.example.com",
  },
  {
    image:
      "https://10barberimages.s3.eu-north-1.amazonaws.com/Static/Main/Feature2.jpg",
    text: "Térkép",
    linkGoto: "/finder",
  },
  {
    image:
      "https://10barberimages.s3.eu-north-1.amazonaws.com/Static/Main/Feature3.jpg",
    text: "Időpontfoglalás",
    linkGoto: "https://www.example.com",
  },
];

export default function Features() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          } else {
            setActiveIndex(null);
          }
        });
      },
      { threshold: 0.8 },
    );

    const cards = document.querySelectorAll(".feature-card");
    cards.forEach((card) => observer.observe(card));
    return () => cards.forEach((card) => observer.unobserve(card));
  }, [isMobile]);

  return (
    <Container
      id="FeatureCards"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {FeatureCards.map((feature, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={8}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              data-index={index}
              className="feature-card"
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                width: "100%",
                maxWidth: 350,
                height: 600,
                padding: 0,
                boxShadow: "none",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                ...(isMobile
                  ? {
                      ...(activeIndex === index && {
                        transform: "scale(1.05)",
                        boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)",
                      }),
                    }
                  : {
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)",
                        "& .liquid-fill": {
                          transform: "translateY(0%)",
                        },
                        "& .feature-text": {
                          opacity: 1,
                          visibility: "visible",
                        },
                        "& img": {
                          filter: "blur(5px)",
                          transition: "filter 0.3s ease",
                        },
                      },
                    }),
              }}
            >
              <CardContent sx={{ padding: 0 }}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={feature.image}
                    alt={`Card Image ${index + 1}`}
                    style={{
                      width: "350px",
                      height: "600px",
                      objectFit: "cover",
                      transition: "filter 0.3s ease",
                    }}
                  />
                  <Box
                    className="liquid-fill"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(128, 128, 128, 0.3)",
                      filter: "blur(0px)",
                      transform: isMobile
                        ? activeIndex === index
                          ? "translateY(0%)"
                          : "translateY(100%)"
                        : "translateY(100%)",
                      transition: "transform 0.4s ease-out",
                    }}
                  />
                  <Typography
                    className="feature-text"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      fontSize: 24,
                      fontWeight: "bold",
                      opacity: activeIndex === index ? 1 : 0,
                      visibility: activeIndex === index ? "visible" : "hidden",
                      transition: "opacity 0.3s ease-in-out, visibility 0.3s",
                    }}
                  >
                    {feature.text}
                  </Typography>

                  {feature.linkGoto && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: 22,
                          fontWeight: "bold",
                          marginRight: 1,
                          marginBottom: 2,
                        }}
                      >
                        Tovább
                      </Typography>
                      <a
                        href={feature.linkGoto}
                        rel="noopener noreferrer"
                        style={{
                          color: "white",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ArrowCircleRightIcon
                          sx={{
                            color: "white",
                            fontSize: 22,
                            fontWeight: "bold",
                            marginRight: 1,
                            marginBottom: 2,
                          }}
                        ></ArrowCircleRightIcon>
                      </a>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
