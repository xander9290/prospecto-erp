"use client";

import { Button, Form } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";

type TInputs = {
  searchKey: string;
};

function FormSearchHeader({ search }: { search: (key: string) => void }) {
  const { register, handleSubmit } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = (data) => {
    if (search) {
      search(data.searchKey);
    }
  };

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (search) {
      search(value);
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
          onChange={handleOnchange}
        />
        <Button type="submit" size="sm" variant="info">
          <i className="bi bi-search"></i>
        </Button>
      </Form.Group>
    </Form>
  );
}

export default FormSearchHeader;
