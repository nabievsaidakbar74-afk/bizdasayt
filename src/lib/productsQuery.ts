export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const LOAD_MORE_STEP = 10;

export type ProductsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const emptyProductsMeta = (
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
): ProductsMeta => ({
  page,
  limit,
  total: 0,
  totalPages: 0,
});

export function withProductPagination(
  searchParam: Record<string, string | string[] | undefined>,
) {
  const query = new URLSearchParams();

  Object.entries(searchParam).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (value !== undefined && value !== "") {
      query.append(key, value);
    }
  });

  const page = Number(query.get("page"));
  const limit = Number(query.get("limit"));
  query.set("page", String(Number.isFinite(page) && page > 0 ? page : DEFAULT_PAGE));
  query.set(
    "limit",
    String(Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT),
  );

  return query;
}
