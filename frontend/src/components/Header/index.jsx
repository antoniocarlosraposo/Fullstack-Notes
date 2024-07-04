import { RiShutDownLine } from "react-icons/ri";
import { Container, Profile, Logout } from "./styles";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const { signOut } = useAuth();

  function handleSignOut() {
    signOut();
  }
  return (
    <Container>
      <Profile to="/profile">
        <img src="https://github.com/rodrigorgtic.png" alt="User photo" />

        <div>
          <span>Welcome</span>
          <strong>Antonio Raposo</strong>
        </div>
      </Profile>

      <Logout onClick={handleSignOut}>
        <RiShutDownLine />
      </Logout>
    </Container>
  );
}
