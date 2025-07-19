"use client";

import { many2oneSource } from "@/libs/many2one-source";
import { useEffect, useRef, useState } from "react";
import { Dropdown, Form, Spinner } from "react-bootstrap";

type Many2oneFieldProps = {
  model: string;
  onChange?: (id: string | number) => void;
};

type Record = { id: number | string; label: string };

function Many2oneField({ model, onChange }: Many2oneFieldProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (record: Record) => {
    setLabel(record.label);
    setShowDropdown(false);
    onChange?.(record.id);
  };

  const fetchRecords = async () => {
    if (!label || !model) {
      setRecords([]);
      return;
    }

    setLoading(true);
    try {
      const res = await many2oneSource({ model, label });
      if (res.success) {
        setRecords(res.data as Record[]);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error(error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRecords();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [label]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <Form.Control
        value={label}
        onChange={handleChange}
        placeholder="Buscar..."
        autoComplete="off"
      />

      <Dropdown
        show={showDropdown && records.length > 0}
        style={{ width: "100%" }}
      >
        <Dropdown.Menu
          show
          style={{
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            borderTop: "none",
          }}
        >
          {records.map((record) => (
            <Dropdown.Item key={record.id} onClick={() => handleSelect(record)}>
              {record.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {loading && (
        <div style={{ marginTop: 4, fontSize: "0.8rem", color: "#666" }}>
          <Spinner animation="border" size="sm" className="me-2" />
        </div>
      )}
    </div>
  );
}

export default Many2oneField;
