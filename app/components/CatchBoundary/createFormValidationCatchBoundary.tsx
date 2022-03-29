import React from "react";
import { useCatch } from "remix";
import { ValidationError } from "yup";
import { RequestContext } from "../context";
import { CatchBoundary } from "./CatchBoundary";

interface FormValidationBoundaryFactoryFunction {
    (
        component: React.FunctionComponent | React.ComponentClass,
    ): () => React.ReactNode;
}

export let createFormValidationCatchBoundary: FormValidationBoundaryFactoryFunction =
    function (component) {
        return function FormValidationCatchBoundary() {
            let caugth = useCatch();

            if (ValidationError.isError(caugth)) {
                return (
                    <RequestContext.Provider
                        value={{ validationError: caugth.data }}
                    >
                        {React.createElement(component, {})}
                    </RequestContext.Provider>
                );
            }

            return <CatchBoundary />;
        };
    };
