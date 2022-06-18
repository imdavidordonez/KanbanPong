import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import AuthModal from "./AuthModal";
import { Menu, Transition } from "@headlessui/react";
import {
  HomeIcon,
  LogoutIcon,
  PlusIcon,
  CollectionIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  {
    label: "Create a new story",
    icon: PlusIcon,
    href: "/create",
  },
  {
    label: "My Stories",
    icon: HomeIcon,
    href: "/stories",
  },
  {
    label: "Logout",
    icon: LogoutIcon,
    onClick: signOut,
  },
];

const Layout = ({ children = null }) => {
  // Call the useSession hook to retrieve the current session
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === "loading";

  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  // State of openModal onclick button open
  const openModal = () => setShowModal(true);
  // State of openModal onclick button close
  const closeModal = () => setShowModal(false);

  return (
    <>
      <Head>
        <title>Kanban Pong | Group Productivity and Project Management</title>
        <meta
          name="title"
          content="Improve the productivity of your development team and manage your tasks with a graphical interface."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="h-16 w-full shadow-md">
          <div className="h-full container mx-auto">
            <div className="h-full px-4 flex justify-between items-center space-x-4">
              <Link href="/">
                <a className="flex items-center space-x-1">
                  <CollectionIcon className="shrink-0 w-8 h-8 text-blue-500" />
                  <span className="text-xl font-bold text-gray-600 tracking-wide">
                    | Kanban{" "}
                    <span className="text-blue-500 font-bold">Pong</span>
                  </span>
                </a>
              </Link>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    session?.user ? router.push("/create") : openModal();
                  }}
                  className="hidden sm:block hover:bg-gray-200 hover:text-blue-700 transition px-3 py-1 rounded-md"
                >
                  Create a User Story
                </button>
                {isLoadingUser ? (
                  <div className="h-8 w-[75px] bg-gray-200 animate-pulse rounded-md" />
                ) : user ? (
                  <Menu as="div" className="relative z-50">
                    <Menu.Button className="flex items-center space-x-px group">
                      <div className="shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9">
                        {user?.image ? (
                          <Image
                            src={user?.image}
                            alt={user?.name || "Avatar"}
                            layout="fill"
                          />
                        ) : (
                          <UserIcon className="text-gray-400 w-6 h-6" />
                        )}
                      </div>
                      <ChevronDownIcon className="w-5 h-5 shrink-0 text-gray-500 group-hover:text-current" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-72 overflow-hidden mt-1 divide-y divide-gray-100 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="flex items-center space-x-2 py-4 px-4 mb-2">
                          <div className="shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9">
                            {user?.image ? (
                              <Image
                                src={user?.image}
                                alt={user?.name || "Avatar"}
                                layout="fill"
                              />
                            ) : (
                              <UserIcon className="text-gray-400 w-6 h-6" />
                            )}
                          </div>
                          <div className="flex flex-col truncate">
                            <span>{user?.name}</span>
                            <span className="text-sm text-gray-500">
                              {user?.email}
                            </span>
                          </div>
                        </div>

                        <div className="py-2">
                          {menuItems.map(
                            ({ label, href, onClick, icon: Icon }) => (
                              <div
                                key={label}
                                className="px-2 last:border-t last:pt-2 last:mt-2"
                              >
                                <Menu.Item>
                                  {href ? (
                                    <Link href={href}>
                                      <a className="flex items-center  space-x-2 py-2 px-4 rounded-md hover:bg-gray-100">
                                        <Icon className="w-5 h-5 shrink-0 text-gray-500" />
                                        <span>{label}</span>
                                      </a>
                                    </Link>
                                  ) : (
                                    <button
                                      className="w-full flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100"
                                      onClick={onClick}
                                    >
                                      <Icon className="w-5 h-5 shrink-0 text-gray-500" />
                                      <span>{label}</span>
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            )
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    type="button"
                    onClick={openModal}
                    className="ml-4 px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white transition"
                  >
                    {" "}
                    Log In{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto">
          <div className="px-4 py-12">
            {typeof children === "function" ? children(openModal) : children}
          </div>
        </main>

        <AuthModal show={showModal} onClose={closeModal} />
        <footer className="bg-white rounded-lg flex  justify-center shadow p-4 ">
          <span className="text-sm text-gray-500 text-center ">
            Developed by{" "}
            <a
              target="_blank"
              href="https://github.com/imdavidordonez"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              David Ordoñez
            </a>
          </span>
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default Layout;