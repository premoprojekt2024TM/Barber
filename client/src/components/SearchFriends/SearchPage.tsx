import { useState, useEffect } from "react";
import {
  CssBaseline,
  Box,
  Stack,
  Container,
  Pagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import AppTheme from "../../shared-theme/AppTheme";
import SideMenu from "../Shared/SideMenu";
import AppNavbar from "../Shared/AppNavbar";
import SearchBar from "./SearchBar";
import FriendsList from "./FriendList";
import { axiosInstance } from "../../utils/axiosInstance";
import { Friend } from "./Friend"; // Import from centralized type

// Function to transform API data to match Friend type
const transformWorkerToFriend = (worker: any): Friend => {
  // Use first and last name if available, otherwise fall back to username
  const fullName =
    worker.firstName && worker.lastName
      ? `${worker.firstName} ${worker.lastName}`
      : worker.username;

  return {
    userId: worker.userId.toString(), // Convert to string but keep as userId
    name: fullName,
    username: worker.username,
    avatar: worker.profilePic || "/placeholder.svg?height=200&width=200",
  };
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workers, setWorkers] = useState<Friend[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const workersPerPage = 4;

  // Fetch workers from API
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/v1/list");

        if (response.data && response.data.data) {
          const transformedWorkers = response.data.data.map(
            transformWorkerToFriend,
          );
          setWorkers(transformedWorkers);
          setFilteredWorkers(transformedWorkers);
        }
      } catch (err: any) {
        console.error("Error fetching workers:", err);
        setError(err.response?.data?.message || "Failed to load workers");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (!query.trim()) {
      setFilteredWorkers(workers);
      return;
    }

    const filtered = workers.filter(
      (worker) =>
        worker.name.toLowerCase().includes(query.toLowerCase()) ||
        worker.username.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredWorkers(filtered);
  };

  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(
    indexOfFirstWorker,
    indexOfLastWorker,
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={() => ({
            flexGrow: 1,
            overflow: "auto",
            paddingTop: { xs: "80px", sm: "0" },
            backgroundAttachment: "fixed",
            minHeight: "100vh",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 2 },
            }}
          >
            <Container
              maxWidth="md"
              sx={{
                mt: 4,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: "none",
                  zIndex: -1,
                },
              }}
            >
              <SearchBar onSearch={handleSearch} />
              <Box sx={{ mt: 4 }}>
                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error" align="center" sx={{ my: 4 }}>
                    {error}
                  </Typography>
                ) : filteredWorkers.length === 0 ? (
                  <Typography align="center" sx={{ my: 4 }}>
                    Nem található ilyen nevű felhasználó.Próbáld máshogy.
                  </Typography>
                ) : (
                  <>
                    <FriendsList
                      friends={currentWorkers}
                      searchQuery={searchQuery}
                    />
                    {totalPages > 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 4,
                        }}
                      >
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Container>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
