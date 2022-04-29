import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import cx from 'classnames'

export default function Home() {
  const [physicians, setPhysicians] = useState()
  const [selectedPhysician, setSelectedPhysician] = useState()
  const [appointments, setAppointments] = useState()

  useEffect(() => {
    (async () => {
      const { data: physicians } = await axios.get('/api/physicians')
      setPhysicians(physicians)
      setSelectedPhysician(physicians[0])
    })()
  }, [])

  useEffect(() => {
    if (selectedPhysician) {
      (async () => {
        const { data: appointments } = await axios.get(`/api/physicians/${selectedPhysician.id}/appointments`)
        setAppointments(appointments)
      })()
    }
  }, [selectedPhysician])

  return (
    <div className='page'>
      <div className="container">
        <div className='left'>
          <Image width={79} height={18.33} alt="Notable logo" src="/notable-logo.svg" />

          <h2 className='sidebar-heading'>Physicians</h2>

          {!!physicians?.length && (
            <ul className='physician-list'>
              {physicians.map(p => (
                <li className={cx('physician-li', {
                  liActive: selectedPhysician.id === p.id
                })} key={p.id} onClick={() => setSelectedPhysician(p)}>
                  <span className='overlap'>{p.last_name}, {p.first_name}</span>
                  <span className='underlap' />
                </li>
              ))}
            </ul>
          )}

          <button className='logout-btn' onClick={() => {
            alert('You logged out!')
            window.location.href = 'https://google.com'
          }}>Logout</button>
        </div>

        <div className="right">
          {selectedPhysician && (
            <>
              <h2 className='physician-heading'>Dr. {selectedPhysician.first_name} {selectedPhysician.last_name}</h2>
              <a className="physician-email" href={`mailto:${selectedPhysician.email}`}>{selectedPhysician.email}</a>
            </>
          )}

          {!!appointments?.length && (
            <table cellPadding={0} cellSpacing={0}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Kind</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td>{appt.id}</td>
                    <td>{appt.first_name} {appt.last_name}</td>
                    <td>{appt.time}</td>
                    <td>{appt.kind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #242226;
        }

        .container {
          display: flex;
        }

        .left, .right {
          padding: 30px;
        }

        .left {
          background: #F4F4F6;
          border-right: 1px solid #E8E8E8;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .right {
          min-width: 600px;
        }
        
        .sidebar-heading {
          font-size: 16px;
          text-transform: uppercase;
          margin-top: 30px;
          margin-bottom: 10px;
        }

        .physician-list {
          margin-bottom: 30px;
        }

        .physician-li {
          margin-left: 20px;
          list-style: none;
          cursor: pointer;
          position: relative;
          padding: 5px 0;
        }

        .overlap {
          position: relative;
          z-index: 1;
        }

        .overlap::before {
          position: absolute;
          left: -20px;
          top: 6px;
          content: '';
          width: 4px;
          height: 4px;
          border: 1px solid #242226;
          border-radius: 999px;
        }

        .underlap {
          position: absolute;
          content: '';
          width: calc(100% + 80px);
          height: 100%;
          left: -50px;
          top: 0;
        }

        .physician-li:hover,
        .liActive {
          color: white;
        }

        .physician-li:hover > .underlap,
        .liActive > .underlap {
          background: #367BDD;
        }

        .physician-li:hover > .overlap::before,
        .liActive > .overlap::before {
          border-color: white;
        }

        .physician-heading {
          font-size: 30px;
        }

        .physician-email {
          margin-top: 10px;
          margin-bottom: 30px;
          display: block;
        }

        .physician-email:hover {
          text-decoration: underline;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 10px;
        }

        th {
          background: #367BDD;
          color: white;
          text-align: left;
        }

        td {
          border: 1px solid #eee;
        }

        tr:nth-of-type(2n + 2) td {
          background: #f8f8f8;
        }

        .logout-btn {
          background: #367BDD;
          color: white;
          border-radius: 4px;
          padding: 10px 30px;
          border: 0;
          margin-top: auto;
          font-size: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
