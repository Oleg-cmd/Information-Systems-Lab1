"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import userStore from "../stores/UserStore";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await userStore.signin(username, password);
      } else {
        await userStore.signup(username, password, role);
      }

      navigate("/");
    } catch (error) {
      // Обработка ошибок
      console.error(error);
      alert("Ошибка авторизации/регистрации");
    }
  };

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>{isLogin ? "Вход" : "Регистрация"}</CardTitle>
        <CardDescription>
          {isLogin ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='username'>Логин</Label>
              <Input
                id='username'
                placeholder='Введите логин'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='password'>Пароль</Label>
              <Input
                id='password'
                type='password'
                placeholder='Введите пароль'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLogin && (
              <div className='flex flex-col space-y-1.5'>
                <Label>Роль</Label>
                <RadioGroup
                  value={role}
                  onValueChange={setRole}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='USER'
                      id='USER'
                    />
                    <Label htmlFor='USER'>Пользователь</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='ADMIN'
                      id='ADMIN'
                    />
                    <Label htmlFor='ADMIN'>Администратор</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col space-y-2'>
        <Button
          className='w-full'
          onClick={handleSubmit}
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </Button>
        <Button
          variant='link'
          className='w-full'
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Нет аккаунта? Зарегистрируйтесь"
            : "Уже есть аккаунт? Войдите"}
        </Button>
      </CardFooter>
    </Card>
  );
}
