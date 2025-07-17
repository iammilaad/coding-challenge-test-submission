import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";

describe("Form component", () => {
  const mockOnSubmit = jest.fn((e) => e.preventDefault());

  const formEntries = [
    {
      name: "firstName",
      placeholder: "First Name",
      extraProps: { value: "", onChange: jest.fn() },
    },
    {
      name: "lastName",
      placeholder: "Last Name",
      extraProps: { value: "", onChange: jest.fn() },
    },
  ];

  test("renders label and inputs", () => {
    render(
      <Form
        label="Personal Info"
        loading={false}
        formEntries={formEntries}
        onFormSubmit={mockOnSubmit}
        submitText="Submit"
      />
    );
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
  });

  test("calls onFormSubmit when form is submitted", () => {
    render(
      <Form
        label="Personal Info"
        loading={false}
        formEntries={formEntries}
        onFormSubmit={mockOnSubmit}
        submitText="Submit"
      />
    );
    const formElement = screen.getByTestId("form-element");
    fireEvent.submit(formElement);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test("button is disabled when loading is true", () => {
    render(
      <Form
        label="Personal Info"
        loading={true}
        formEntries={formEntries}
        onFormSubmit={mockOnSubmit}
        submitText="Submitting..."
      />
    );
    const button = screen.getByRole("button", { name: /Submitting.../i });
    expect(button).toBeDisabled();
  });
});
