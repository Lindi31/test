import { StateCreator, create } from "zustand";
import { PersistOptions, createJSONStorage, persist } from "zustand/middleware";
import { apiGetCall } from "./axios";

//load it from types/user
export type User = {
  id?: number | null;
  name?: string | null;
  username?: string | null;
  localPassword?: string | null;
  password?: string | null;
  initials?: string | null;
  mail?: string | null;
  mobilePhone?: string | null;
  phone?: string | null;
  department?: string | null;
  active?: boolean | null;
  version?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  allRights?: object[] | string[] | null;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean> | boolean;
  logout: () => void;
};
type MyPersist = (
  config: StateCreator<UserStore>,
  options: PersistOptions<UserStore>
) => StateCreator<UserStore>;

export const useUserStore = create<UserStore>(
  (persist as MyPersist)(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      login: async (username: string, password: string) => {
        // let user = await fakeAuth(username, password);
        let user = await getAccess(username, password);
        if (user) {
          set({
            user: user,
          });
          // localStorage.setItem("user", JSON.stringify(user));
          return true;
        }
        set({ user: null });
        // localStorage.removeItem("user");
        return false;
      },
      logout: () => {
        set({ user: null });
        // localStorage.removeItem("user");
      },
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      version: 1, // version number
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' (localStorage |sessionStorage) is used
      //       migrate: (persistedState, version) => persistedState, // optional migration function
      //       partialize: (state) => ({ user: state.user }), // optional partialization function
    }
  )
);
const serverPath = process.env.NEXT_PUBLIC_API_URL;

async function getAccess(
  username: string,
  password: string
): Promise<User | false> {
  let path = serverPath + "User/loggedInUser";
  let newUser = { username: username, password: password };
  // const header = {
  //   ...getHeader(newUser),
  //   auth: { username: username, password: password },
  // };
  let user = await apiGetCall(newUser, path);

  user.password = password;

  return user;
}

// For Testing
// @ts-ignore
async function fakeAuth(
  username: string,
  password: string
): Promise<User | false> {
  // Simulate API call or any async logic
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (username === "aaa" && password === "aaa") {
    const user = {
      id: 1,
      name: "John Doe",
      username: "johnny",
      password: "123",
      menu: [],
    };
    return user;
  }
  return false;
}
