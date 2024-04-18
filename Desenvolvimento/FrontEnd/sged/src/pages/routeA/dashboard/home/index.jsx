import SideBar from "../../components/SideBar";
import NavBar from "../../components/NavBar";
import CardDashboard from "../../components/Card/CardDashboard";
import Title from "../../components/Title/Title";
import Subtitle from "../../components/Title/Subtitle";
import TableDashboard from "../../components/Table/TableDashboard";
import { FaTableCellsLarge, FaFile } from "react-icons/fa6";
import { useMontage } from '../../../../object/modules/montage';
import { useEffect, useState } from "react";
import SideBarAdm from "../../components/Adm/SideBarAdm";
import Modal from "../../components/Modal/ModalExclusao";
import { Trash } from "@phosphor-icons/react";

export default function Home() {

  const [open, setOpen] = useState(false)
  const { componentMounted } = useMontage();

  useEffect(() => {
    componentMounted();
  }, []);

  const data = ["Guilherme", "Gabriel", "Neto", "Lopes", "Victor", "Pedro"];

  return (
    <div className="flex min-h-screen">
      <div className="flex h-full w-full">
        <div className="fixed w-full">
          <NavBar />
        </div>
        <div className="fixed mt-[64px]">
          <SideBarAdm />
        </div>
        <div className="mt-[64px] ml-[270px] pl-2 mr-[25px] w-full">
          <br />
          <Title title="Visão Geral" />
          <Subtitle subtitle="Solicitações Gerais" />
          <div className="flex gap-3 justify-around pt-[40px]">
            <CardDashboard title="NOVAS" total={0} />
            <CardDashboard title="EM ANDAMENTO" total={0} />
            <CardDashboard title="PENDENTE" total={0} />
            <CardDashboard title="ATRASADO" total={0} />
            <CardDashboard title="PRAZO HOJE" total={0} />
          </div>
          {/* <button className="btn btn-primary mt-5" onClick={() => setOpen(true)}>
            Modal
          </button> */}

          {/* <Modal open={open} onClose={() => setOpen(false)}>
            <div className="text-center w-56">
              <Trash size={56} className="mx-auto text-red-500" />
              <div className="mx-auto my-4 w-48">
                <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this item?
                </p>
              </div>
              <div className="flex gap-4">
                <button className="btn btn-danger w-full">Delete</button>
                <button
                  className="btn btn-light w-full"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal> */}
          <TableDashboard title="Últimos Andamentos" data={data.slice(0, 4)} icon={<FaTableCellsLarge />} />
          <TableDashboard title="Últimos Arquivos" data={data.slice(0, 4)} icon={<FaFile />} />
          <TableDashboard title="Últimos Arquivos" data={data.slice(0, 4)} icon={<FaFile />} />
          <TableDashboard title="Últimos Arquivos" data={data.slice(0, 4)} icon={<FaFile />} />
        </div>
      </div>
    </div>
  );
}