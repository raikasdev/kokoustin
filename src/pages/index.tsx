import Logo from "@/components/Logo";
import HomePage from "@/components/pages/HomePage";
import LoginPage from "@/components/pages/LoginPage";
import { auth } from "@/firebase.config";
import { Anchor, Container, Flex, Loader, Text, Title } from "@mantine/core";
import { User, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (loading === true) setLoading(false);
      console.log(user);
      console.log(auth);
      setUser(user);
    });
  }, []);

  return (
    <Flex align="center" justify="center" h="100vh">
      <Container size={1000} my={40}>
        <Flex justify={"center"}>
          <Logo
            height="2rem"
            style={{ maxWidth: "50vw", marginBottom: "1rem" }}
          />
        </Flex>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Kokoustin² v{process.env.APP_VERSION} ({process.env.COMMIT_HASH})
        </Text>
        {loading && (
          <>
            <Flex align="center" justify="center" m="xl">
              <Loader />
            </Flex>
            <Text align="center">Tarkistetaan istuntoa...</Text>
          </>
        )}
        {!loading && !auth.currentUser && <LoginPage />}
        {!loading && auth.currentUser && <HomePage />}
      </Container>
    </Flex>
  );
}
