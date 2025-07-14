"use client";

import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type TInputs = {
  searchKey: string;
};

function FormSearchHeader({ basePath }: { basePath: string }) {
  const route = useRouter();
  const { register, handleSubmit } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = (data) => {
    const cleanedSearch = basePath.replace(/&?search=[^&]*/, ""); // Remove existing search param if any
    if (data.searchKey) {
      route.push(`${cleanedSearch}&search=${data.searchKey}`); // Update the URL with the new search value
    } else {
      route.push(cleanedSearch); // If searchKey is empty, just navigate to the base path
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="d-flex">
        <Form.Control
          {...register("searchKey")}
          size="sm"
          type="text"
          placeholder="Buscar..."
          autoComplete="off"
        />
        <Button type="submit" size="sm" variant="primary">
          <i className="bi bi-search"></i>
        </Button>
      </Form.Group>
    </Form>
  );
}

export default FormSearchHeader;
