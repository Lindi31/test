import { faker } from "@faker-js/faker";
import { z } from "zod";

export type User = {
  id: Number;
  name: String;
  firstName: null | String;
  userName: String;
  password: null | String;
  email: String;
  address: {
    street: String | null;
    city: String | null;
    zipcode: String | null;
    geo: {
      lat: Number | null;
      lng: Number | null;
    };
  };
  phone: String;
  website: String;
  company: {
    name: String | null;
    catchPhrase: String | null;
    bs: String | null;
  };
  lastLogin: Date | null;
};

export const emptyUser: User = {
  id: 0,
  name: "",
  firstName: null,
  userName: "",
  password: null,
  email: "",
  address: {
    street: null,
    city: null,
    zipcode: null,
    geo: {
      lat: null,
      lng: null,
    },
  },
  phone: "",
  website: "",
  company: {
    name: null,
    catchPhrase: null,
    bs: null,
  },
  lastLogin: null,
};

// Define the Zod schema for the User type
export const userSchema = z.object({
  id: z.number().min(1),
  name: z.string().nonempty(),
  firstName: z.string().nonempty("Required"),
  userName: z.string().nonempty("Required"),
  password: z.string().nullable(),
  email: z.string().email(),
  address: z.object({
    street: z.string().nullable(),
    city: z.string().nullable(),
    zipcode: z.string().nullable(),
    geo: z.object({
      lat: z.number().nullable(),
      lng: z.number().nullable(),
    }),
  }),
  phone: z.string().nonempty(),
  website: z.string().url(),
  company: z.object({
    name: z.string().nullable(),
    catchPhrase: z.string().nullable(),
    bs: z.string().nullable(),
  }),
  lastLogin: z.date().nullable(),
});

export type FormValues = z.infer<typeof userSchema>;

export type Users = User[];

export async function getUsers() {
  // let users = await axios.get(serverPath);
  let users: User[] = faker.helpers.multiple(createRandomUser, {
    count: 100,
  });
  // Add a delay of 1000 ms (1 second)
  await new Promise((resolve) => setTimeout(resolve, 500));

  return users;
}

export function getUser(id: number) {
  return createRandomUser(id);
}

export function getUsersNotASync() {
  let users: User[] = faker.helpers.multiple(createRandomUser, {
    count: 50,
  });
  return users;
}

export function createRandomUser(id: null | number = null): User {
  // const fakedId = id ? id : faker.number.int();
  const fakedId = id
    ? faker.helpers.rangeToNumber({ min: id, max: id })
    : faker.helpers.rangeToNumber({ min: 1, max: 5000 });
  return {
    // id: faker.string.uuid(),
    id: fakedId,
    name: faker.person.lastName(),
    firstName: faker.person.firstName(),
    userName: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    address: {
      street: faker.location.street(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      geo: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      },
    },
    phone: faker.phone.number(),
    website: faker.internet.url(),
    company: {
      name: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      bs: faker.company.buzzPhrase(),
    },
    lastLogin: faker.date.past(),
  };
}

//=========== Axios Version
// const serverPath = "http://localhost:8080/user/";
// const serverPath = "https://jsonplaceholder.typicode.com/users";

// export async function getUsers() {
//   let contacts = await axios
//     .get(serverPath)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
//   return contacts;
// }

// export async function getUser(id: Number) {
//   let user = await axios.get(serverPath + "/" + id);
//   return user;
// }
//=========== Axios Version END
