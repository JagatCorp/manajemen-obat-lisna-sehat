
const FilterStatus = ({ statusFilter, setStatusFilter }) => {
    return (
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="Masuk">Masuk</option>
            <option value="Keluar">Keluar</option>
            
        </select>
    );
};

export default FilterStatus;
