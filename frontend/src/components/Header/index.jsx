import { RiShutDownLine } from "react-icons/ri";
import { Container, Profile, Logout } from "./styles";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const { signOut, user } = useAuth();

  function handleSignOut() {
    signOut();
  }
  return (
    <Container>
      <Profile to="/profile">
        <img
          src="https://avatars.githubusercontent.com/u/7716103?v=4"
          alt="User photo"
        />

        <div>
          <span>Welcome</span>
          <strong>{user.name}</strong>
        </div>
      </Profile>

      <Logout onClick={handleSignOut}>
        <RiShutDownLine />
      </Logout>
    </Container>
  );
}
