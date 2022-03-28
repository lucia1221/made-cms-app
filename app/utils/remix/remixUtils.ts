import { AppLoadContext } from "@remix-run/server-runtime";
import { RequestResponse } from "~/models/RequestResponse";

type FormDataExtension = Omit<FormData, "get"> & {
  get<T extends FormDataEntryValue = FormDataEntryValue>(
    name: string,
  ): T | null;
};

export interface ActionFunctionArg<Params = {}> {
  request: Omit<Request, "formData"> & {
    formData: () => Promise<FormDataExtension>;
  };
  params: Params;
  context: AppLoadContext;
}

/**
 * Action function with guarded return type.
 */
export interface ActionDataFunction<Params = {}> {
  (arg: ActionFunctionArg<Params>): Response | Promise<Response>;
}

export interface ActionDataFunctionNext<D = unknown, E = unknown, Params = {}> {
  (arg: ActionFunctionArg<Params>): RequestResponse<D, E> | Promise<RequestResponse<D, E>>;
}
