import { auth } from "@/firebase.config";
import { Button, Paper, PasswordInput, TextInput } from "@mantine/core";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setLoading(true);
    setError(null);
    await setPersistence(auth, browserLocalPersistence);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("Väärä sähköpostiosoite tai salasana");
        setLoading(false);
      });
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <TextInput
          label="Sähköpostiosoite"
          placeholder="roni@mikroni.fi"
          required
          value={email}
          onChange={(event) => {
            setError(null);
            setEmail(event.currentTarget.value);
          }}
          error={error}
        />
        <PasswordInput
          label="Salasana"
          placeholder="salasana123"
          required
          mt="md"
          value={password}
          onChange={(event) => {
            setError(null);
            setPassword(event.currentTarget.value);
          }}
          error={error}
        />
        <Button fullWidth type="submit" mt="xl" loading={loading}>
          Kirjaudu
        </Button>
      </form>
    </Paper>
  );
}
