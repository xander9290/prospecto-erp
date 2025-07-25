"use client";

import { useController, Control, FieldValues, Path } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";

type Record = {
  id: number | string;
  label: string;
  [key: string]: unknown; // resto de propiedades
};

type Many2oneFieldProps<T extends FieldValues> = {
  name: string;
  control: Control<T>;
  model: string;
  disabled?: boolean;
  readOnly?: boolean;
  isInvalid?: boolean;
  invisible?: boolean;
};

function Many2oneField<T extends FieldValues>({
  name,
  control,
  model,
  disabled,
  readOnly,
  isInvalid,
  invisible,
}: Many2oneFieldProps<T>) {
  const {
    field: { value, onChange },
  } = useController({ name: name as Path<T>, control });

  const [label, setLabel] = useState("");
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const fetchRecords = async (query: string) => {
    if (!query || !model) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/many2one/${model}?q=${encodeURIComponent(query)}`
      );
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
        setShowDropdown(true);
      } else {
        setRecords([]);
        setShowDropdown(false);
      }
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    if (!model) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/many2one/${model}`);
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (label.trim() === "") {
      fetchRecommended();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setLabel(input);
    debounceFetch(input);
    if (input === "") {
      onChange(null);
    }
  };

  const handleSelect = (record: Record) => {
    setLabel(record.label);
    onChange(record); // Guarda el objeto completo
    setShowDropdown(false);
  };

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const debounceFetch = (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchRecords(query), 300);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value == null) {
      setLabel("");
      return;
    }
    if (value && typeof value === "object" && "label" in value) {
      setLabel(value.label);
    } else if (value) {
      const fetchLabel = async () => {
        try {
          const res = await fetch(`/api/many2one/${model}?id=${value}`);
          const json = await res.json();
          if (json.success && json.data) {
            setLabel(json.data.label);
            onChange(json.data); // Reemplaza el ID por el objeto completo
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchLabel();
    }
  }, [value]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: invisible ? "none" : "inline" }}
    >
      <InputGroup size="sm">
        <Form.Control
          value={label}
          onChange={handleInputChange}
          onClick={handleMouseEnter}
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          disabled={disabled}
          readOnly={readOnly}
          isInvalid={isInvalid}
          size="sm"
        />
        <Button
          variant="outline-secondary"
          type="button"
          onClick={handleMouseEnter}
          disabled={disabled}
        >
          {loading ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <i className="bi bi-chevron-down"></i>
          )}
        </Button>
      </InputGroup>

      {showDropdown && (
        <ListGroup className="position-absolute w-100 z-3 shadow-sm bg-white mt-1">
          {!loading && records.length === 0 && (
            <ListGroup.Item>Sin resultados</ListGroup.Item>
          )}
          {!loading &&
            records.map((opt) => (
              <ListGroup.Item
                key={opt.id}
                action
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}
    </div>
  );
}

export default Many2oneField;
