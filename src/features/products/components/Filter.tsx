'use client'

import React from 'react'
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  InputNumber,
  Tooltip,
  Typography,
} from 'antd'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import Link from 'next/link'

const { Title, Text } = Typography

type FilterValues = {
  categories: string[]
  brands: string[]
  minPrice: number | null
  maxPrice: number | null
}

type FilterOption = {
  label: string
  value: string
}

type FilterProps = {
  categories?: FilterOption[]
  brands?: FilterOption[]
  onApply?: (filters: FilterValues) => void
}

type LastChanged = {
  type: 'categories' | 'brands'
  value: string
} | null

const initialFilters: FilterValues = {
  categories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
}

function readFilters(params: URLSearchParams): FilterValues {
  const min = params.get('minPrice')
  const max = params.get('maxPrice')

  return {
    categories: params.getAll('category'),
    brands: params.getAll('brand'),
    minPrice:
      min !== null && min !== '' && Number.isFinite(Number(min))
        ? Number(min)
        : null,
    maxPrice:
      max !== null && max !== '' && Number.isFinite(Number(max))
        ? Number(max)
        : null,
  }
}

export default function Filter({
  categories = [],
  brands = [],
  onApply,
}: FilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()

  const [filters, setFilters] = React.useState<FilterValues>(() =>
    readFilters(new URLSearchParams(searchParamsString)),
  )

  const [lastChanged, setLastChanged] =
    React.useState<LastChanged>(null)

  // Browser back/forward orqali URL o'zgarsa,
  // filterlarni URL bilan sinxronlashtirish
  React.useEffect(() => {
    setFilters(readFilters(new URLSearchParams(searchParamsString)))
    setLastChanged(null)
  }, [searchParamsString])

  const priceError =
    filters.minPrice !== null &&
    filters.maxPrice !== null &&
    filters.minPrice > filters.maxPrice

  const updateFilter = <K extends keyof FilterValues>(
    key: K,
    value: FilterValues[K],
  ) => {
    if (key === 'categories' || key === 'brands') {
      const selectedValues = value as string[]
      const previousValues = filters[key] as string[]

      const addedValue = selectedValues.find(
        (item) => !previousValues.includes(item),
      )

      if (addedValue) {
        setLastChanged({
          type: key,
          value: addedValue,
        })
      } else {
        setLastChanged((previous) => {
          if (!previous) return null

          // Olib tashlangan checkbox oxirgi tanlangan
          // checkbox bo'lsa, qolgan tanlanganini topish
          if (
            previous.type === key &&
            !selectedValues.includes(previous.value)
          ) {
            const remainingValue = selectedValues.at(-1)

            return remainingValue
              ? { type: key, value: remainingValue }
              : null
          }

          return previous
        })
      }
    }

    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const updateUrl = (values: FilterValues) => {
    const params = new URLSearchParams(searchParamsString)

    // Avval eski filter parametrlarini o'chirish
    params.delete('category')
    params.delete('brand')
    params.delete('minPrice')
    params.delete('maxPrice')

    // Tanlangan kategoriyalar
    values.categories.forEach((category) => {
      params.append('category', category)
    })

    // Tanlangan brendlar
    values.brands.forEach((brand) => {
      params.append('brand', brand)
    })

    // Min narx
    if (values.minPrice !== null) {
      params.set('minPrice', String(values.minPrice))
    }

    // Max narx
    if (values.maxPrice !== null) {
      params.set('maxPrice', String(values.maxPrice))
    }

    params.set('page', '1')
    params.set('limit', '20')

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    router.replace(url, { scroll: false })
  }

  const handleApply = () => {
    if (priceError) return

    updateUrl(filters)
    onApply?.(filters)
    setLastChanged(null)
  }

  const resetFilters = () => {
    setFilters({ ...initialFilters })
    setLastChanged(null)

    updateUrl(initialFilters)
    onApply?.({ ...initialFilters })
  }

  const renderOptions = (
    options: FilterOption[],
    selected: string[],
    type: 'categories' | 'brands',
    onChange: (values: string[]) => void,
  ) => (
    <div className="max-h-[200px] overflow-y-auto overflow-x-hidden pr-2">
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          const showApply =
            isSelected &&
            lastChanged?.type === type &&
            lastChanged.value === option.value

          return (
            <div
              key={option.value}
              className="flex items-center justify-between gap-2"
            >
              {
                type == "categories" && <Link className={`text-inherit!  ${pathname.includes(option.value) && "font-bold!"}`} href={`/products/${option.value}`}>{option.label}</Link>
              }
              {
                type == "brands" && <Checkbox
                  checked={isSelected}
                  onChange={(event) => {
                    const checked = event.target.checked

                    const nextValues = checked
                      ? [...selected, option.value]
                      : selected.filter((value) => value !== option.value)

                    onChange(nextValues)

                    // Uncheck qilinganda URL'ni darhol yangilash
                    if (!checked) {
                      const nextFilters = {
                        ...filters,
                        [type]: nextValues,
                      }

                      updateUrl(nextFilters)
                      onApply?.(nextFilters)
                      setLastChanged(null)
                    }
                  }}
                >
                  {option.label}
                </Checkbox>
              }


              {showApply && (
                <Tooltip
                  title="Barcha tanlangan filtrlarni qo‘llash"
                  placement="right"
                  open
                >
                  <Button
                    type="primary"
                    size="small"
                    disabled={priceError}
                    onClick={handleApply}
                  >
                    Qo‘llash
                  </Button>
                </Tooltip>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const collapseItems = [
    {
      key: 'categories',
      label: (
        <span className="font-semibold text-gray-800">
          Kategoriyalar
        </span>
      ),
      children: renderOptions(
        categories,
        filters.categories,
        'categories',
        (values) => updateFilter('categories', values),
      ),
    },
    {
      key: 'brands',
      label: (
        <span className="font-semibold text-gray-800">
          Brendlar
        </span>
      ),
      children: renderOptions(
        brands,
        filters.brands,
        'brands',
        (values) => updateFilter('brands', values),
      ),
    },
  ]

  return (
    <aside className="w-full min-w-0 max-w-[300px] rounded-lg border border-gray-200 bg-white px-3 py-4">
      {/* Filter sarlavhasi */}
      <div className="flex items-center justify-between">
        <Title level={5} className="!mb-0">
          Filter
        </Title>

        <Button
          type="link"
          size="small"
          onClick={resetFilters}
          className="!px-0"
        >
          Tozalash
        </Button>
      </div>

      <Divider className="!my-3" />

      {/* Kategoriyalar va brendlar */}
      <Collapse
        ghost
        defaultActiveKey={['categories', 'brands']}
        items={collapseItems}
        className="[&_.ant-collapse-header]:!px-0 [&_.ant-collapse-content-box]:!px-0 [&_.ant-collapse-content-box]:!pt-1"
      />

      <Divider className="!my-3" />

      {/* Narx oralig'i */}
      <section>
        <Title level={5} className="!mb-3">
          Narx oralig‘i
        </Title>

        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0">
            <Text
              type="secondary"
              className="mb-1 block text-xs"
            >
              Min narx
            </Text>

            <InputNumber
              className="!w-full"
              placeholder="0"
              min={0}
              value={filters.minPrice}
              onChange={(value) =>
                updateFilter('minPrice', value)
              }
              formatter={(value) =>
                value === undefined || value === null
                  ? ''
                  : `${value}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ' ',
                  )
              }
              parser={(value) =>
                Number((value ?? '').replace(/\s/g, ''))
              }
            />
          </div>

          <div className="min-w-0">
            <Text
              type="secondary"
              className="mb-1 block text-xs"
            >
              Max narx
            </Text>

            <InputNumber
              className="!w-full"
              placeholder="Cheksiz"
              min={0}
              value={filters.maxPrice}
              onChange={(value) =>
                updateFilter('maxPrice', value)
              }
              formatter={(value) =>
                value === undefined || value === null
                  ? ''
                  : `${value}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ' ',
                  )
              }
              parser={(value) =>
                Number((value ?? '').replace(/\s/g, ''))
              }
            />
          </div>
        </div>

        {priceError && (
          <Text type="danger" className="mt-2 block text-xs">
            Min narx max narxdan katta bo‘lishi mumkin emas.
          </Text>
        )}

        {(filters.minPrice !== null ||
          filters.maxPrice !== null) && (
            <Button
              type="primary"
              size="small"
              className="!mt-3"
              disabled={priceError}
              onClick={handleApply}
            >
              Narxni qo‘llash
            </Button>
          )}
      </section>
    </aside>
  )
}