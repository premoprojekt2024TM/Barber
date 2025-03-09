import { useState, useEffect } from "react";
import { CssBaseline, Box, Stack, Container, Pagination } from "@mui/material";
import AppTheme from "../../shared-theme/AppTheme";
import SideMenu from "../Shared/SideMenu";
import AppNavbar from "../Shared/AppNavbar";
import Header from "../../components/Shared/Header";
import SearchBar from "./SearchBar";
import FriendsList from "./FriendList";
import type { Friend } from "./FriendCard";

const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "alexj",
    avatar: "/placeholder.svg?height=200&width=200",
    mutualFriends: 12,
    isOnline: true,
  },
  {
    id: "2",
    name: "Samantha Williams",
    username: "samw",
    avatar: "/placeholder.svg?height=200&width=200",
    mutualFriends: 8,
    isOnline: false,
  },
  {
    id: "3",
    name: "Michael Brown",
    username: "mikeb",
    avatar: "/placeholder.svg?height=200&width=200",
    mutualFriends: 5,
    isOnline: true,
  },
  {
    id: "4",
    name: "Emily Davis",
    username: "emilyd",
    avatar: "/placeholder.svg?height=200&width=200",
    mutualFriends: 15,
    isOnline: false,
  },
  {
    id: "5",
    name: "David Wilson",
    username: "davidw",
    avatar: "/placeholder.svg?height=200&width=200",
    mutualFriends: 3,
    isOnline: true,
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const friendsPerPage = 4;

  useEffect(() => {
    setFilteredFriends(mockFriends);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);

    if (!query.trim()) {
      setFilteredFriends(mockFriends);
      return;
    }

    const filtered = mockFriends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(query.toLowerCase()) ||
        friend.username.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredFriends(filtered);
  };

  const totalPages = Math.ceil(filteredFriends.length / friendsPerPage);
  const indexOfLastFriend = currentPage * friendsPerPage;
  const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
  const currentFriends = filteredFriends.slice(
    indexOfFirstFriend,
    indexOfLastFriend,
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
            <Header />
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
                <FriendsList
                  friends={currentFriends}
                  searchQuery={searchQuery}
                />
                {totalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </Box>
            </Container>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
