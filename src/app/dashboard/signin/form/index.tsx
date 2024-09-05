"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { type FC } from "react";
import { ActionResult, handleSignIn } from "./actions";
import { useFormState, useFormStatus } from "react-dom";

const initialFormState: ActionResult = {
  errorTitle: null,
  errorDesc: [],
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className="w-full" type="submit">
      {pending ? "Loading..." : "Submit"}
    </Button>
  );
};

const formSignIn: FC = () => {
  const [state, formAction] = useFormState(handleSignIn, initialFormState);

  console.log(state);
  return (
    <div className="flex flex-col w-full h-screen justify-center">
      <div className="px-6 py-12 m-auto">
        <h2 className="mt-4 text-center text-2xl font-bold ">
          Sign in to your account
        </h2>

        {state.errorTitle !== null && (
          <div className="mx-auto my-7 bg-red-500 w-[400px] p-4 rounded-lg text-white">
            <div className="font-bold mb-4">{state.errorTitle}</div>

            <ul className="list-disc list-inside">
              {state.errorDesc?.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <form action={formAction} className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email..."
              name="email"
            />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="password... "
              name="password"
            />
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
};

export default formSignIn;
