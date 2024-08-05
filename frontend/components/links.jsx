import { TableCell, TableRow } from "@/components/ui/table";

export default function LinksVisitors({linkId}){
    const visitors = [
    {
        name: 'x', 
        id: '1',
        totalDuration: '200',
    }, 
    {
        name: 'x', 
        id: '1',
        totalDuration: '200',
    }, 
    {
        name: 'x', 
        id: '1',
        totalDuration: '200',
    }, 
]
  return (
    <>
      {visitors ? ( 
        visitors.map((visitor) => (
          <TableRow key={visitor.id}>
            <TableCell>{visitor.name}</TableCell>
            <TableCell>{visitor.totalDuration}</TableCell>
            <TableCell>
              {/* <Gauge value={view.completionRate} />
               {*/}
               <h1>Hi</h1>
            </TableCell>
          </TableRow>
        ))
      ) : null}
    </>
  );
}