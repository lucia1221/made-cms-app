import { AppLoadContext } from "@remix-run/server-runtime";
import { ThrownResponse } from "remix";
import { ValidationError } from "yup";

type FormDataExtension = Omit<FormData, "get"> & {
  get<T extends FormDataEntryValue = FormDataEntryValue>(
    name: string,
  ): T | null;
};

interface ActionFunctionArg<Params> {
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

/**
 * Check if caugth response is "Unprocessable entity" response
 *
 * @param response
 * @returns
 */
export function isValidationErrorResponse(
  response: ThrownResponse,
): response is ThrownResponse<422, ValidationError> {
  return response.status === 422;
}
