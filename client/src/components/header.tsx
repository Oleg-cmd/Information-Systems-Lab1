import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import userStore from "../stores/UserStore";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Home, User, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  onChangeTable: (
    table:
      | "products"
      | "organizations"
      | "persons"
      | "adress"
      | "location"
      | "special"
      | "admin"
      | "visual"
      | "history"
  ) => void;
}

export const HeaderComponent: React.FC<HeaderProps> = observer(
  ({ onChangeTable }) => {
    const navigate = useNavigate();
    const currentUser = userStore.user;

    const handleLogout = () => {
      userStore.logout();
      navigate("/login");
    };

    if (!currentUser) {
      return (
        <header className='bg-background border-b w-[100%] mb-20'>
          <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <a
                href='/'
                className='flex items-center space-x-2'
              >
                <Home className='h-6 w-6' />
                <span className='text-lg font-bold'>Мой Сайт</span>
              </a>
            </div>
            <div>
              <Button onClick={() => navigate("/login")}>Войти</Button>
            </div>
          </div>
        </header>
      );
    }

    return (
      <header className='bg-background border-b w-[100%] mb-20'>
        <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <a
              href='/'
              className='flex items-center space-x-2'
            >
              <Home className='h-6 w-6' />
              <span className='text-lg font-bold'>Мой Сайт</span>
            </a>
            <nav>
              <ul className='flex space-x-4'>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("products")}
                  >
                    Продукты
                  </button>
                </li>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("organizations")}
                  >
                    Организации
                  </button>
                </li>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("persons")}
                  >
                    Владельцы
                  </button>
                </li>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("adress")}
                  >
                    Адреса
                  </button>
                </li>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("location")}
                  >
                    Локации
                  </button>
                </li>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("special")}
                  >
                    Специальные операции
                  </button>
                </li>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("visual")}
                  >
                    Визуализация
                  </button>
                </li>
                <li>
                  <button
                    className='hover:underline'
                    onClick={() => onChangeTable("history")}
                  >
                    История
                  </button>
                </li>
                {userStore.user?.role === "ADMIN" && (
                  // userStore.user?.approved &&
                  <li>
                    <button
                      className='hover:underline'
                      onClick={() => onChangeTable("admin")}
                    >
                      Регистрация админов
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-muted-foreground'>
              Привет, {currentUser.username}!
            </span>
            <Button
              variant='ghost'
              onClick={handleLogout}
            >
              <LogOut className='h-6 w-6' />
            </Button>
          </div>
        </div>
      </header>
    );
  }
);
