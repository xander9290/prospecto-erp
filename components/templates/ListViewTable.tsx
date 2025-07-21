"use client";

import { useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import Image from "next/image";

function ListViewTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Table
      style={{ fontSize: "0.9rem" }}
      size="sm"
      className={className}
      striped
      hover
    >
      {children}
    </Table>
  );
}

function ListViewHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky-top" style={{ zIndex: 1 }}>
      <tr>{children}</tr>
    </thead>
  );
}

function ListViewColumn({
  children,
  className,
  name,
}: {
  children: React.ReactNode;
  className?: string;
  name: string;
}) {
  return (
    <th
      title={name}
      className={`text-capitalize text-nowrap ${className} fw-bold`}
    >
      {children}
    </th>
  );
}

function ListViewContent({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function ListItemLink({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const router = useRouter();
  return (
    <tr
      style={{ cursor: "pointer", userSelect: "none" }}
      onDoubleClick={() => router.push(path)}
    >
      {children}
    </tr>
  );
}

export function ListItem({
  children,
  className,
  name,
  avatar,
}: {
  children: React.ReactNode;
  className?: string;
  name: string;
  avatar?: string | null;
}) {
  return (
    <td valign="middle" title={name} className={`text-nowrap ${className}`}>
      <div className="d-flex align-items-end">
        {avatar && (
          <Image
            width={25}
            height={25}
            src={avatar || "/image/avatar_default.svg"}
            alt="UserImage"
            className="rounded me-1"
            unoptimized
            style={{
              width: "25px",
              height: "25px",
            }}
          />
        )}
        {children}
      </div>
    </td>
  );
}

ListViewTable.Header = ListViewHeader;
ListViewTable.Column = ListViewColumn;
ListViewTable.Content = ListViewContent;

export default ListViewTable;
