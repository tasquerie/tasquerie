import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../../server/firebase/firebase"

// NOTE: This file is for creating presistent authentication context on the website