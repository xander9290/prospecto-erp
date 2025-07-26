"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useController, Control } from "react-hook-form";
import { Form, Dropdown } from "react-bootstrap";

export interface Many2OneOption {
  id: number | string;
  name: string;
  displayName?: string;
  [key: string]: any;
}

type Props<T extends Many2OneOption> = {
  name: string;
  label?: string;
  control: Control<any>;
  options: T[] | null;
};

export function Many2one<T extends Many2OneOption>({
  name,
  label,
  control,
  options,
}: Props<T>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!query) return options ?? [];
    return (
      options?.filter((opt) =>
        (opt.displayName ?? opt.name)
          .toLowerCase()
          .includes(query.toLowerCase())
      ) ?? []
    );
  }, [query, options]);

  const handleSelect = (option: T) => {
    onChange(option);
    setQuery(option.name);
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  // Cierre al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ⌨️ Soporte de navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 < filteredOptions.length ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredOptions[highlightedIndex];
      if (selected) handleSelect(selected);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef}>
      <Form.Group className="mb-3" controlId={`many2one-${name}`}>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar..."
          autoComplete="off"
          isInvalid={!!error}
          size="sm"
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>

        {isOpen && filteredOptions.length > 0 && (
          <Dropdown show className="w-100 mt-1">
            <Dropdown.Menu
              style={{
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
                overflowX: "hidden",
                zIndex: 1050,
              }}
              className="p-0"
            >
              {filteredOptions.slice(0, 10).map((option, index) => (
                <Dropdown.Item
                  key={option.id}
                  onMouseDown={() => handleSelect(option)}
                  active={index === highlightedIndex}
                >
                  {option.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Form.Group>
    </div>
  );
}
