import * as React from 'react'

const rowsPerPage = 8
const useTablePagination = (data: any[]) => {
	const [page, setPage] = React.useState(0)
	const [visibleRows, setVisibleRows] = React.useState<any[] | null>(null)
	const [paddingHeight, setPaddingHeight] = React.useState(0)

	React.useEffect(() => {
		const rowsOnMount = data.slice(
			0 * rowsPerPage,
			0 * rowsPerPage + rowsPerPage,
		)
		setVisibleRows(rowsOnMount);
	}, [data])
	

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)

		const updatedRows = data.slice(newPage * 8, newPage * 8 + 8)
		setVisibleRows(updatedRows)

		// Avoid a layout jump when reaching the last page with empty rows.
		const numEmptyRows = newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - data.length) : 0

		const newPaddingHeight =  53 * numEmptyRows
		setPaddingHeight(newPaddingHeight)
	}

	return {page, visibleRows, paddingHeight, handleChangePage}
}

export default useTablePagination