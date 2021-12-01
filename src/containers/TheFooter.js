import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span>Miracle</span>
        <span className="ml-1">&copy; 2020</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <span >Miracle</span>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
