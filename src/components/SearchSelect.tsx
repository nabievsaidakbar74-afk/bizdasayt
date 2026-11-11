"use client";

import { Select, Spin } from "antd";

export type SearchOption = { value: string; label: string };

export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder = "Tanlang",
  loading,
  disabled,
}: {
  value?: string;
  onChange: (value: string) => void;
  options: SearchOption[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <Select
      showSearch
      allowClear
      value={value || undefined}
      onChange={(next) => onChange(next || "")}
      options={options}
      placeholder={placeholder}
      loading={loading}
      disabled={disabled}
      className="search-select w-full"
      classNames={{ popup: { root: "search-select-dropdown" } }}
      size="large"
      listHeight={240}
      virtual
      filterOption={(input, option) =>
        String(option?.label ?? "")
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      notFoundContent={
        loading ? (
          <div className="flex justify-center py-3">
            <Spin size="small" />
          </div>
        ) : (
          "Topilmadi"
        )
      }
    />
  );
}
